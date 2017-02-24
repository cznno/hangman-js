jQuery.fn.flash = function( color, duration )
{
  var current = this.css( 'color' );
  this.animate( { color: 'rgb(' + color + ')' }, duration / 2 );
  this.animate( { color: current }, duration / 2 );
}